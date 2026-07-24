from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="QR Canvas API",
    description="Backend service for QR Canvas studio & high-resolution vector generator",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "QR Canvas API is running"
    }