
using System;
using DatingApp.API.Models;

namespace DatingApp.API.Dto
{
    public class PhotoForDetailedDto
    {
        public int Id { get; set; } 
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }     
        public bool IsMain { get; set; }
    }
}