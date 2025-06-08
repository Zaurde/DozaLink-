from fastapi import FastAPI, HTTPException, Depends, Body, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional, List
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

app = FastAPI(
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://doza-link.vercel.app"],  # Deine Vercel-URL!
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

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    hashed_password: str

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

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "DEIN_GEHEIMER_KEY"  # Setze hier einen sicheren Key!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/register")
def register(email: str = Body(...), password: str = Body(...)):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if user:
            raise HTTPException(status_code=400, detail="E-Mail existiert bereits")
        hashed_password = get_password_hash(password)
        user = User(email=email, hashed_password=hashed_password)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"msg": "User created"}

@app.post("/api/login")
def login(email: str = Body(...), password: str = Body(...)):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if user is None:
            raise credentials_exception
        return user

@app.get("/api/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email}