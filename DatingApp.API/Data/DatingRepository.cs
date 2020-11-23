using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        public DataContext _context { get; }
        public DatingRepository(DataContext _context) 
        {
            this._context = _context;
               
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<User> GetUser(int Id)
        {
            var user = await _context.Users.Include(p=> p.Photos)
                .FirstOrDefaultAsync(u=> u.id == Id);
            return user;    
        }
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p=>p.Photos).AsQueryable();
            users= users.Where(u=>u.id != userParams.UserId);
            users= users.Where( u=> u.Gender == userParams.Gender);

            if(userParams.MinAge != 18 || userParams.MaxAge != 99){
                var minDob = DateTime.Now.AddYears(-userParams.MaxAge-1);
                var maxDob = DateTime.Now.AddYears(-userParams.MinAge);

                users=users.Where(u=> u.DateOfBirth >= minDob && u.DateOfBirth<=maxDob);
            }

            if(!string.IsNullOrEmpty( userParams.OrderBy)){
                switch(userParams.OrderBy){
                    case "created":
                        users=users.OrderByDescending(u=>u.Created);
                        break;
                    default:
                        users=users.OrderByDescending(u=>u.LastActive);
                        break;
                }        
            }
            
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);    
        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int Id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync( u => u.Id== Id);
            return photo;    
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(p => p.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsMain);
        }
    }
}