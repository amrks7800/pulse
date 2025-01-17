"use server"

import { AppwriteException, ID, Models, Query } from "node-appwrite"
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )

    return newUser
  } catch (err) {
    if (err && err instanceof AppwriteException && err?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ])

      return existingUser?.users[0]
    }

    console.log(err)
  }
}

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId)
    return parseStringify(user)
  } catch (err) {
    console.error(err)
  }
}

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      )

      file = await storage.createFile(
        BUCKET_ID, // bucket id
        ID.unique(),
        inputFile
      )
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID, // database id
      PATIENT_COLLECTION_ID, // patient collection id
      ID.unique(),
      {
        ...patient,
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
      }
    )

    return parseStringify(newPatient) as Models.Document
  } catch (error) {
    console.log(error)
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      [Query.equal("userId", userId)]
    )
    return parseStringify(patients.documents[0])
  } catch (err) {
    console.error(err)
  }
}
