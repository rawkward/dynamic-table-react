type BaseUser = {
  "user_id": number,
  "first_name": string,
  "last_name": string,
  "age": number,
  "email": string
}

type ExtendedUserFields = {
  "user_id": number,
  "first_name": string,
  "last_name": string,
  "age": number,
  "email": string,
  "country": string,
  "city": string,
  "interests": string,
  "relationship_status": RelationshipStatus,
  "education_level": EducationLevel,
  "job_title": string,
  "profile_created_date": string,
  "last_login_date": string,
  "profile_picture_url": string
}

type RelationshipStatus = "In a relationship" | "Single" | "Married";
type EducationLevel = "High School" | "College" | "Graduate School";

export type User = BaseUser & ExtendedUserFields;