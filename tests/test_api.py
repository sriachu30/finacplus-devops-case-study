from fastapi.testclient import TestClient

from app.main import MOCK_ACCOUNTS, app

client = TestClient(app)

EXPECTED_ACCOUNT_FIELDS = {
    "id",
    "customer_name",
    "account_type",
    "balance",
    "currency",
}


def test_health_returns_http_200() -> None:
    response = client.get("/health")
    assert response.status_code == 200


def test_health_returns_healthy_status() -> None:
    response = client.get("/health")
    assert response.json() == {"status": "healthy"}


def test_accounts_returns_http_200() -> None:
    response = client.get("/api/accounts")
    assert response.status_code == 200


def test_accounts_returns_expected_fields() -> None:
    response = client.get("/api/accounts")
    accounts = response.json()

    assert isinstance(accounts, list)
    assert len(accounts) == len(MOCK_ACCOUNTS)

    for account in accounts:
        assert set(account.keys()) == EXPECTED_ACCOUNT_FIELDS


def test_get_account_by_id_returns_existing_account() -> None:
    account_id = MOCK_ACCOUNTS[0]["id"]
    response = client.get(f"/api/accounts/{account_id}")

    assert response.status_code == 200
    assert response.json() == MOCK_ACCOUNTS[0]


def test_get_account_by_id_returns_404_for_missing_account() -> None:
    response = client.get("/api/accounts/ACC-9999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Account 'ACC-9999' not found"}
