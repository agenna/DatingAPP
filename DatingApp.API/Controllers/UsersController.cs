using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        public IDatingRepository _repo { get; }
        public IMapper _mapper { get; }

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFormRepo = await _repo.GetUser(currentUserId);
            userParams.UserId = currentUserId;
/*             if( string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = userFormRepo.Gender == "female" ? "male" : "female";
            }
 */            
            var users = await _repo.GetUsers(userParams);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            
            Response.AddPagination(users.CurrentPage, users.PageSize, 
                users.TotalCount, users.TotalPage);
            
            return Ok(usersToReturn); 
        }
        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id){
           var user = await _repo.GetUser(id);
           var userToReturn = _mapper.Map<UserForDetailedDto>(user);
           return Ok(userToReturn); 
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto){

            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userRepo = await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto,userRepo);
           
            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception("Updating user {id} failed on server"); 
        }
        [HttpPost("{id}/like/{recipientId}")] 
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            if(id == recipientId)
                return BadRequest("Not possible input like on yourself");
                
            var likeFromRepo = await _repo.GetLike(id, recipientId);
            if(likeFromRepo != null)
                return BadRequest("Like already present");
            
            var recipientFromRepo = await _repo.GetUser(recipientId);
            if(recipientFromRepo == null)
                return NotFound();

            var like = new Like{
                LikerId=id,
                LikeeId=recipientId
            };

            _repo.Add<Like>(like); 
            if(await _repo.SaveAll())
                return Ok();

            throw new Exception("Adding like failed on server");   
        }
    }
}