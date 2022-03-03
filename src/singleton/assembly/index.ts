import { storage, Context, PersistentUnorderedMap } from "near-sdk-core"
import { ApplicantReference } from './models/ApplicantReference';
import { ApplicantReferenceList } from "./models/ApplicantReferenceList";


@nearBindgen
export class Contract {
 
  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`
    }
  }

  @mutateState()
  write(key: string, value: string): string {
    storage.set(key, value)
    return `✅ Data saved. ( ${this.storageReport()} )`
  }

  @mutateState()
  addReference(applicantId: string,
    contactName: string,
    company: string,
    comment: string): string {
    let applicantList = new ApplicantReferenceList(applicantId);
    const referenceId = applicantList.addReference(contactName, company, comment);
    return `✅ applicant reference saved. ( ${referenceId} )`;
  }

  getApplicantReferences(applicantId: string): ApplicantReference[] {
    let applicantList = new ApplicantReferenceList(applicantId);
    return applicantList.getReferences();
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
