from sqlmodel import SQLModel , create_engine , Session, text  
from . import setting



connection_strings = str(setting.USER_SERVICE_DATABASE_URL).replace(
    "postgresql" , "postgresql+psycopg2"
)

engine = create_engine(connection_strings , connect_args={} ,  pool_recycle=300)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        try:
            session.exec(text('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR;'))
            session.commit()
            print("✓ Checked/updated user table schema successfully")
        except Exception as e:
            print(f"✗ Failed to run user table migration: {e}")


def get_session():
    with Session(engine) as session:
        yield session



