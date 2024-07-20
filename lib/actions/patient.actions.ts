"use server"

import { AppwriteException, ID, Models, Query } from "node-appwrite"
import {
  DATABASE_ID,
  databases,
  PATIENT_COLLECTION_ID,
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

      // TODO: replace with env vars in production
      file = await storage.createFile(
        "66904efd0012ce962f17", // bucket id
        ID.unique(),
        inputFile
      )
    }

    const newPatient = await databases.createDocument(
      "66904e1600309eba275a", // database id
      "66904e51001757c435c7", // patient collection id
      ID.unique(),
      {
        ...patient,
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${"https://cloud.appwrite.io/v1"}/storage/buckets/${"66904efd0012ce962f17"}/files/${
          file?.$id
        }/view?project=${"66904d4f000c2868dcff"}`,
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
