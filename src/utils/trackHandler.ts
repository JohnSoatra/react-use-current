import { isRef } from "vref";

function trackHandler(targets: any | any[]) {
  if (isRef(targets)) {
    
  } else if (Array.isArray(targets)) {
    return 
  }
}
export default trackHandler;