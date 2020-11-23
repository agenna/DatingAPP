namespace DatingApp.API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize {
            get { return pageSize;}
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        public string OrderBy { get; set; }

        public int UserId {get; set;}

        public string Gender {get; set;}

        public int MaxAge {get; set;} = 99;

        public int MinAge {get; set;} = 18;
    }
}