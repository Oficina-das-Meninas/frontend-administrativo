import { AccordionCollaborator } from "./accordion-collaborator"
import { AccordionContentType } from "./accordion-content-type"
import { AccordionDocument } from "./accordion-document"

export type AccordionContent = {
    categoryName: string,
    type: AccordionContentType,
    documents?: AccordionDocument[],
    collaborators?: AccordionCollaborator[]
}
