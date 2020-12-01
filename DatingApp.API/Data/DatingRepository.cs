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
            if(!string.IsNullOrEmpty( userParams.Gender))
                users= users.Where( u=> u.Gender == userParams.Gender);

            if(userParams.Likers)
            {
                var usersLikers = await GetUserLikes(userParams.UserId, true);    
                users = users.Where(u=>usersLikers.Contains(u.id)); 
                //var userCount = users.Where(u=>usersLikers.Contains(u.id)).ToList();
            }

            if(userParams.Likees)
            {
                var usersLikees = await GetUserLikes(userParams.UserId, false); 
                //var idSel = usersLikees.ToList(); 
                users = users.Where(u=>usersLikees.Contains(u.id)); 
                //var userCount = users.Where(u=>usersLikees.Contains(u.id)).ToList();
            }

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

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(u=>u.Likers)
                .Include(u=>u.Likees)
                .FirstOrDefaultAsync(u=>u.id == id);
            
            if(likers){
                var userlikers= user.Likers.Where(u=>u.LikeeId == id).Select(u=>u.LikerId);
                /* var userlikersCount= user.Likers.Where(u=>u.LikeeId == id)
                    .Select(u=>u.LikerId).ToList(); */
                return userlikers;
            }
            else{
                var userlikees = user.Likees.Where(u=>u.LikerId == id).Select(u=>u.LikeeId);
                /* var userlikeesCount = user.Likees.Where(u=>u.LikerId == id)
                    .Select(u=>u.LikeeId).ToList(); */
                return user.Likees.Where(u=>u.LikerId == id).Select(u=>u.LikeeId);
            }
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

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likers.FirstOrDefaultAsync(u=>u.LikerId == userId && u.LikeeId == recipientId); 
        }

        public async Task<Message> GetMessage(int Id)
        {
            //return await _context.Messages.FirstOrDefaultAsync(m => m.Id == Id);
            return await _context.Messages.Include(u=>u.Sender).ThenInclude(u=>u.Photos)
                .Include(u=>u.Recipient).ThenInclude(u=>u.Photos)
                .FirstOrDefaultAsync(m => m.Id == Id );
  
        }

        public async Task<PagedList<Message>> GetMessageForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.Include(u=>u.Sender).ThenInclude(u=>u.Photos)
                .Include(u=>u.Recipient).ThenInclude(u=>u.Photos).AsQueryable();

            switch(messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(m=> m.RecipientId == messageParams.UserId && 
                                                   m.RecipientDeleted == false);
                    break;    

                case "Outbox":
                    messages = messages.Where(m=> m.SenderId == messageParams.UserId &&
                                                   m.SenderDeleted == false);
                    break;
                
                default:
                    messages = messages.Where(m=> m.IsRead== false &&  m.RecipientId == messageParams.UserId &&         
                                                   m.RecipientDeleted == false);
                    break;
            }
            messages = messages.OrderByDescending(m=>m.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize); 
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages.Include(u=>u.Sender).ThenInclude(u=>u.Photos)
                .Include(u=>u.Recipient).ThenInclude(u=>u.Photos)
                .Where(m=> m.SenderId == userId && m.RecipientId== recipientId && m.SenderDeleted == false||
                        m.SenderId== recipientId && m.RecipientId == userId && m.RecipientDeleted == false)
                        .OrderByDescending(m=>m.MessageSent)
                        .ToListAsync();
            return messages;

        }
    }
}