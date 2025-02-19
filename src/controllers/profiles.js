const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const redis_client = require("../config/redis");
const prisma = new PrismaClient();


const profileResponse = (user, following) => ({
    profile: {
      username: user.username,
      bio: user.bio || '',
      image: user.image || '',
      following: following || false
    }
  });

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user ? req.user.userId : null;

    // Find user by username
    const userProfile = await prisma.user.findUnique({
        where: { username },
        select: { userId: true, username: true, bio: true, image: true },
      });
  
    if (!userProfile) {
        return res.status(404).json({ errors: { body: ["Profile not found"] } });
    }
    console.log(userProfile)
    // check if current user is following the profile
    let following = false;
    if (currentUserId) {
        const isFollowing = await prisma.user.findFirst({
          where: {
            userId: currentUserId,
            following: {
              some: {
                userId: userProfile.userId,
              },
            },
          },
        });
        following = !!isFollowing;
      }
    res.status(200).json(profileResponse(userProfile));
  } catch (error) {
    console.log(error);
    res.status(422).json({ errors: { body: ['Could not get profile'] } });
  }
};


const followUser = async (req, res) => {
    try {
        const { username } = req.params;
        const followerId = req.user.userId;

        // Find the user to follow
        const userToFollow = await prisma.user.findUnique({
            where: { username },
            select: { userId: true, username: true, bio: true, image: true}
        });

        if (!userToFollow) {
            return res.status(404).json({ errors: { body: ["User not found"] } });
        }

        // Check if the user is already following
        const isFollowing = await prisma.user.findFirst({
            where: {
                userId: followerId,
                following: {
                    some: { userId: userToFollow.userId }
                }
            }
        });

        if (isFollowing) {
            return res.status(400).json({ errors: { body: ["Already following this user"] } });
        }
        
        
        // Add the follow relationship
        await prisma.$transaction([
            // Add the target user to the current user's "following" list
            prisma.user.update({
              where: { userId: followerId },
              data: {
                following: { connect: { userId: userToFollow.userId } }, 
              },
            }),
            // Add the current user to the target user's "followedBy" list
            prisma.user.update({
              where: { userId: userToFollow.userId },
              data: {
                followedBy: { connect: { userId: followerId } }, 
              },
            }),
        ]);
          
        console.log("Follower ID:", followerId);
        console.log("User to Follow ID:", userToFollow.userId);
        res.status(200).json(profileResponse(userToFollow, true));
        
    } catch (error) {
        console.log(error);
        res.status(422).json({ errors: { body: ['Check error'] } });
    }
}
module.exports ={
    getProfile,
    followUser
};
