using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dto
{
    public class UserLoginDto
    {
        public string Username { get; set; }

        public string Password { get; set; }
      
    }
}