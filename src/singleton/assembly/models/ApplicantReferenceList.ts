import { math, Context, PersistentUnorderedMap } from "near-sdk-core"
import { ApplicantReference } from './ApplicantReference';

@nearBindgen
export class ApplicantReferenceList {

    private references: PersistentUnorderedMap<u32, ApplicantReference> = new PersistentUnorderedMap<u32, ApplicantReference>("referencesByApplicant");

    getReferences () : ApplicantReference[] {
        return this.references.values();
    }

    addReference(applicantId: u32,
        contactName: string,
        company: string,
        comment: string): u32 {
        
        const reference = new ApplicantReference(applicantId, contactName, company, comment);
        this.references.set(reference.id, reference);
        return reference.id;
      }
}
