import boto3
from datetime import datetime
from ..config import get_settings
from fastapi import HTTPException
from botocore.exceptions import ClientError

settings = get_settings()

class DynamoDBService:
    def __init__(self):
        self.dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
            endpoint_url=settings.aws_endpoint_url
        )
        self.table = self.dynamodb.Table(settings.DYNAMODB_TABLE_NAME)

    async def create_order(self, order_data: dict) -> dict:
        item = {
            'id': str(order_data['id']),
            'date': str(order_data['date']),
            'status': str(order_data['status']),
            'request_file': str(order_data['request_file']),
            'created_at': str(order_data['created_at']),
            'updated_at': str(order_data['updated_at'])
        }
        
        try:
            self.table.put_item(Item=item)
            return order_data
        except ClientError as e:
            print(f"DynamoDB error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))        
        
        
    async def get_orders(self, filter_type: str = None) -> list:
        if filter_type and filter_type != 'all':
            response = self.table.scan(
                FilterExpression='#type = :type_val',
                ExpressionAttributeNames={'#type': 'type'},
                ExpressionAttributeValues={':type_val': filter_type}
            )
        else:
            response = self.table.scan()
        
        return response['Items']

    async def search_orders(self, query: str) -> list:
        # Note: DynamoDB doesn't support native full-text search
        # For production, consider using OpenSearch or similar
        response = self.table.scan()
        items = response['Items']
        
        return [
            item for item in items
            if query.lower() in str(item.get('id', '')).lower() or
               query.lower() in str(item.get('type', '')).lower() or
               query.lower() in str(item.get('date', '')).lower()
        ]

    async def update_order_status(self, order_id: str, new_status: str) -> dict:
        try:
            response = self.table.update_item(
                Key={'id': order_id},
                UpdateExpression='SET #status = :status, updated_at = :timestamp',
                ExpressionAttributeNames={
                    '#status': 'status'
                },
                ExpressionAttributeValues={
                    ':status': new_status,
                    ':timestamp': datetime.utcnow().isoformat()
                },
                ReturnValues='ALL_NEW'
            )
            return response['Attributes']
        except ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Database error: {str(e)}"
            )