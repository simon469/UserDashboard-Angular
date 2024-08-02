import User from "./User";

interface Response {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[]; 
    support: {
      url: string;
      text: string;
    }
  }

  export default Response;