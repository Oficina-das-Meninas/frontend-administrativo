import { AccordionContentType } from "../../enums/transparency-accordion/accordion-content-type"
import { AccordionCollaborator } from "./accordion-collaborator"
import { AccordionDocument } from "./accordion-document"

export type AccordionContent = {
    id?: string,
    categoryName: string,
    priority: number,
    type: AccordionContentType,
    documents?: AccordionDocument[],
    collaborators?: AccordionCollaborator[]
}
