from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FinacPlus API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_ACCOUNTS: list[dict[str, Any]] = [
    {
        "id": "ACC-1001",
        "customer_name": "Alex Morgan",
        "account_type": "checking",
        "balance": 12500.75,
        "currency": "USD",
    },
    {
        "id": "ACC-1002",
        "customer_name": "Jordan Lee",
        "account_type": "savings",
        "balance": 48250.00,
        "currency": "USD",
    },
    {
        "id": "ACC-1003",
        "customer_name": "Riley Chen",
        "account_type": "investment",
        "balance": 103780.42,
        "currency": "USD",
    },
]


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/api/accounts")
def list_accounts() -> list[dict[str, Any]]:
    return MOCK_ACCOUNTS


@app.get("/api/accounts/{account_id}")
def get_account(account_id: str) -> dict[str, Any]:
    for account in MOCK_ACCOUNTS:
        if account["id"] == account_id:
            return account

    raise HTTPException(
        status_code=404,
        detail=f"Account '{account_id}' not found",
    )