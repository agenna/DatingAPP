using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dto
{
    public class UserRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(20, MinimumLength=8, ErrorMessage="Password Lenght between 8 and 20")]
        public string Password { get; set; }
    }
}