import { math, Context } from "near-sdk-core"
import { AccountId, Timestamp } from '../../../utils';

@nearBindgen
export class ApplicantReference {
	id: u32;
    applicantId: string;
    date: Timestamp;
	contactName: string;
    company: string;
    comment: string;
    signedBy: AccountId;
	
	constructor(applicantId: string,
        contactName: string,
        company: string,
        comment: string) {
		
        this.id = math.hash32<string>(`${applicantId}${contactName}${company}`);
        this.date = Context.blockTimestamp;
		this.applicantId = applicantId;
		this.contactName = contactName;
		this.company = company;
        this.comment = comment;
        this.signedBy = Context.sender;
	}
}
