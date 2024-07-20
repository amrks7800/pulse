import * as sdk from "node-appwrite"

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env as Record<string, string>

const client = new sdk.Client()

// TODO: replace with environment variables before deployment
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66904d4f000c2868dcff")
  .setKey(
    "90742798d93db1fc179e1ff6c5c2638e27278dea3cff385a8f62ab92fc5263432819b4dbf52aa55c79437d5441e1e2bd307cea15c4f0e12168ac6d14e99d9ad5a7bb4d240d474dcd92458044d46e68d22f164a6ce48aeeb9dee46058abd7511a36a5a58b22eb725e7101c2e65e9b197354ec01259e77fdc9e8b6244e154a2f45"
  )

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const users = new sdk.Users(client)
export const messaging = new sdk.Messaging(client)
