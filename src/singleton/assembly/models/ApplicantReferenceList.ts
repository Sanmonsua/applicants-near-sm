import { math, Context, PersistentUnorderedMap } from "near-sdk-core"
import { ApplicantReference } from './ApplicantReference';

@nearBindgen
export class ApplicantReferenceList {

    private references: PersistentUnorderedMap<u32, ApplicantReference>;
    private applicantId: string;

    constructor(applicantId: string) {
        this.references = new PersistentUnorderedMap<u32, ApplicantReference>(applicantId);
        this.applicantId = applicantId;
    }

    getReferences () : ApplicantReference[] {
        return this.references.values();
    }

    addReference(
        contactName: string,
        company: string,
        comment: string): u32 {
        const reference = new ApplicantReference(this.applicantId, contactName, company, comment);
        this.references.set(reference.id, reference);
        return reference.id;
      }
}
