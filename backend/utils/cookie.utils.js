const cookieToken = async (user, res) => {

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken;

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        maxAge: 3 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
        sameSite: "Strict"
    }

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: `User logged in successfully`,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                isVerified: user.isVerified
            },
            accessToken,
            refreshToken
        })
}

export { cookieToken }