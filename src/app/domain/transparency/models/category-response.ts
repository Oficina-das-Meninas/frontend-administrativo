import { CollaboratorResponse } from "./collaborator-response"
import { DocumentResponse } from "./document-response"

export type CategoryResponse = {
    id: string,
    name: string,
    isImage: boolean,
    priority: number,
    documents?: DocumentResponse[],
    collaborators?: CollaboratorResponse[]
}
