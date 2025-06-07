from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Datenbankmodell
class Listing(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    price: float
    category: str
    location: str
    images: Optional[str] = None  # Wir speichern die Bild-URLs als JSON-String

# SQLite-Engine
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)

# Datenbank initialisieren
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Endpunkt: Alle Listings abrufen
@app.get("/api/listings", response_model=List[Listing])
def get_listings():
    with Session(engine) as session:
        listings = session.exec(select(Listing)).all()
        return listings

# Endpunkt: Neues Listing anlegen
@app.post("/api/listings", response_model=Listing)
def create_listing(listing: Listing):
    with Session(engine) as session:
        session.add(listing)
        session.commit()
        session.refresh(listing)
        return listing