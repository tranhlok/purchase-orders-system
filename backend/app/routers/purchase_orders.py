from typing import Optional
from datetime import datetime
import time
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from ..services.dynamodb import DynamoDBService
from ..services.s3 import S3Service

router = APIRouter()
dynamodb_service = DynamoDBService()
s3_service = S3Service()

@router.post("/orders")
async def create_order(
    request_file: UploadFile = File(...)
):
    try:
        # Generate order ID using timestamp
        order_id = str(int(time.time() * 1000))
        
        # Read file content
        file_content = await request_file.read()
        
        # Upload request file to S3
        request_key = await s3_service.upload_file(
            file_content,
            request_file.filename,
            order_id
        )

        # Create order in DynamoDB with existing schema
        order_data = {
            "id": str(order_id),
            "date": datetime.now().strftime("%m/%d/%Y"),
            "type": "Processing",
            "request_file": str(request_key),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        order = await dynamodb_service.create_order(order_data)
        return order
        
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders")
async def get_orders(
    filter_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    if search:
        orders = await dynamodb_service.search_orders(search)
    else:
        orders = await dynamodb_service.get_orders(filter_type)
    return orders

@router.get("/orders/{order_id}/files/{file_type}")
async def get_file_url(order_id: str, file_type: str):
    key = f"{order_id}/{file_type}"
    url = await s3_service.get_file_url(key)
    return {"url": url}

@router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    updated_order = await dynamodb_service.update_order_status(order_id, status)
    return updated_order