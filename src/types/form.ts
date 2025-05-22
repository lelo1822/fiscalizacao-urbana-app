
export interface FormErrors {
  issueType: string;
  description: string;
  photos: string;
  complainantName: string;
  complainantPhone: string;
  complainantAddress: string;
  [key: string]: string;
}
