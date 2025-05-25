from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{items_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"items_id": item_id, "q": q}