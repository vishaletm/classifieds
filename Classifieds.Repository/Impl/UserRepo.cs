﻿using Classifieds.Domain.Model;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Classifieds.Repository.Impl
{
    public class UserRepo : GenericRepo<User>, IUserRepo
    {
        private ApplicationContext context;

        public UserRepo(ApplicationContext context) : base(context)
        {
            this.context = context;
        }
        /// <summary>
        /// Authenticate a user
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns>Authenticated user</returns>
        public User AuthenticateUser(String email, String password) 
        {
            try
            {
               User user = context.Users
                .Where(x => x.Email == email && x.Password == password)
                .Include(x => x.UserDetail)
                .SingleOrDefault();

                return user;
            }
            catch(InvalidOperationException ex)
            {
                throw;
            }


        }
        /// <summary>
        /// After successful registration of a user, generate a token that will
        /// be used to activate the account. Save this token in the database
        /// </summary>
        /// <param name="id">PK of the user</param>
        /// <param name="token">Verification token</param>
        /// <returns></returns>
        public bool CreateVerificationToken(long id, string token)
        {
            bool success = false;


            try
            {
               
                User user = Find(id);

                if(user != null)
                {
                    user.VerificationToken = token;
                    context.Entry(user).Property(x => x.VerificationToken).IsModified = true;
                    context.SaveChanges();
                    success = true;
                }
                
            }
            catch(Exception ex)
            {
                Console.WriteLine("Error in CreateVerificationToken: \n" + ex.Message);
            }

            return success;
        }

        public new User Create(User user)
        {
           return context.Add(user).Entity;
        }
        /// <summary>
        /// User token to activate account
        /// </summary>
        /// <param name="token">user's token</param>
        /// <returns>number of rows changed</returns>
        public int ActivateAccount(long id, string token)
        {
            int changed = 0;
            try
            {
                var user = context.Users.SingleOrDefault(u => u.VerificationToken == token && u.ID==id);

                if(user != null)
                {
                    user.IsVerified = 1;
                    context.Entry(user).Property(x => x.IsVerified).IsModified = true;
                    changed = context.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return changed;
        }
    }
}
