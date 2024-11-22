from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import purchase_orders

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(purchase_orders.router, prefix="/api")