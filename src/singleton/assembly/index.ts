import { storage, Context, PersistentUnorderedMap } from "near-sdk-core"
import { ApplicantReference } from './models/ApplicantReference';
import { ApplicantReferenceList } from "./models/ApplicantReferenceList";


@nearBindgen
export class Contract {
  private message: string = 'hello world'
  private applicants: PersistentUnorderedMap<u32, ApplicantReferenceList> = new PersistentUnorderedMap<u32, ApplicantReferenceList>("applicants");


  // return the string 'hello world'
  helloWorld(): string {
    return this.message
  }

  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ] and "this.message" is [ ${this.message} ]`
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`
    }
  }

  @mutateState()
  write(key: string, value: string): string {
    storage.set(key, value)
    this.message = 'data was saved' // this is why we need the deorator @mutateState() above the method name
    return `✅ Data saved. ( ${this.storageReport()} )`
  }

  @mutateState()
  addReference(applicantId: u32,
    contactName: string,
    company: string,
    comment: string): string {
    
    let applicantReferences =  this.applicants.get(applicantId);
    if (applicantReferences == null) applicantReferences = new ApplicantReferenceList();
    const referenceId = applicantReferences.addReference(applicantId, contactName, company, comment);
    this.applicants.set(applicantId, applicantReferences);

    return `✅ applicant reference saved. ( ${referenceId} )`;
  }

  getApplicantReferences(applicantId: u32): ApplicantReference[] {

    assert(!this.applicants.contains(applicantId), `applicantId doesn't exists ${applicantId}`);
    let applicantReferences = this.applicants.get(applicantId);
    if (applicantReferences == null) applicantReferences = new ApplicantReferenceList();

    return applicantReferences.getReferences();
  }  

  // private helper method used by read() and write() above
  private storageReport(): string {
    return `storage [ ${Context.storageUsage} bytes ]`
  }
}

/**
 * This function exists only to avoid a compiler error
 *

ERROR TS2339: Property 'contains' does not exist on type 'src/singleton/assembly/index/Contract'.

     return this.contains(key);
                 ~~~~~~~~
 in ~lib/near-sdk-core/storage.ts(119,17)

/Users/sherif/Documents/code/near/_projects/edu.t3/starter--near-sdk-as/node_modules/asbuild/dist/main.js:6
        throw err;
        ^

 * @param key string key in account storage
 * @returns boolean indicating whether key exists
 */
function isKeyInStorage(key: string): bool {
  return storage.hasKey(key)
}
