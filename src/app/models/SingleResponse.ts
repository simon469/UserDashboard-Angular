import User from "./User";

interface SingleResponse {
    data: User; 
    support: {
      url: string;
      text: string;
    }
}

export default SingleResponse;