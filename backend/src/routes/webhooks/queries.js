export const GET_MEETING_PARTICIPANTS = `
  query getParticipants($id: Int!) {
    meetings_by_pk(id: $id){
      title
      meeting_date
      title
      user{
        email
        fullName
      }
      participants {
        user{
          email
        }
      }
    }
  }
`;

export const GET_MEETING_PARTICIPANTS_REMINDER_QUERY = `
  query getParticipants($id: Int!) {
    meetings_by_pk(id: $id){
      title
      user{
        email
        fullName
      }
      participants(
        where: {
          is_approved: {
            _eq: true
          }
        }
      ) {
        user{
          email
          fullName
        }
      }
    }
  }
`;
