"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ModeIcon from '@mui/icons-material/Mode';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CardProfile from "./../../components/profile/ProfileCard";
import ProfileImageUploadPopUp from "./../../components/profile/ProfileImageUpLoadPopUp";


const API_URL = process.env.NEXT_PUBLIC_URL;

export default function UserInfo() {
  
// 이미지 수정 로직
const [uploadPopupOpen, setUploadPopupOpen] = useState(false);

const handleOpenUploadPopup = () => {
  setUploadPopupOpen(true);
};

const handleCloseUploadPopup = () => {
  setUploadPopupOpen(false);
};

  const handleSaveImage = async (imageFile) => {
    if (!session) {
      console.log('User session not available.');
      return;
    }
  
    try {
      const authToken = session.user.id;
  
      // 1. 프로필 이미지 업로드
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const uploadResponse = await axios.post(API_URL + '/uploadImage', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const uploadedImageUrl = uploadResponse.data.imageUrl;
  
      // 2. 서버에 프로필 이미지 수정 요청
      const updateUserResponse = await axios.patch(
        API_URL + '/users/updateProfileImage',
        { profileImage: uploadedImageUrl },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      // 3. 서버 응답을 받아서 페이지 데이터 업데이트 등의 작업 수행
      const updatedUserData = updateUserResponse.data;
      console.log('Updated user data:', updatedUserData);
  
      // 필요한 경우 userInfo 상태 업데이트
      setUserInfo(updatedUserData);
  
      // 팝업 닫기
      handleCloseUploadPopup();
    } catch (error) {
      console.error('Error uploading image or updating profile:', error.message);
    }
  };

  const defaultTheme = createTheme();
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  // session 데이터
  useEffect(() => {
    async function fetchUserInfo() {
      console.log(session);
      if (session) {
        try {
          const nickName = session.user.name;
          const authToken = session.user.id;
          console.log(authToken);

          const response = await axios.get(
            API_URL + `/users/info/${nickName}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          console.log(response.data);
          setUserInfo(response.data);
        } catch (error) {
          setError(error);
        }
      }
    }

    fetchUserInfo();
  }, [session]);

  // 에러 표현
  if (!session) {
    return <p>No session</p>;
  }

  if (error) {
    return <p>Error fetching user info: {error.message}</p>;
  }

  if (!userInfo) {
    return <p>Loading...</p>;
  }

  // 수정할 데이터 수집 메소드
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <Grid container>
        {/* 여기는 왼쪽 정보란 -> 컴포넌트화 할 수 있음 */}
        <Grid item xs={4}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
            {/* <Button sx={{ mb: 2, position: 'relative' }}>
              <Avatar sx={{ m: 2, width: 200, height: 200 }}>
                <Avatar
                    alt="User porfile"
                    src={userInfo.profileImage}
                    sx={{ width: 200, height: 200 }}
                  />
              </Avatar>
              <ModeIcon
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 30,
                  height: 30,
                  backgroundColor: 'white',
                  color: '#f783ac',
                  borderRadius: '50%',
                }} />
            </Button> */}
            <Button sx={{ mb: 2, position: 'relative' }} onClick={handleOpenUploadPopup}>
              <Avatar sx={{ m: 2, width: 200, height: 200 }}>
                <Avatar
                    alt="User porfile"
                    src={userInfo.profileImage}
                    sx={{ width: 200, height: 200 }}
                  />
              </Avatar>
              <ModeIcon
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 30,
                  height: 30,
                  backgroundColor: 'white',
                  color: '#f783ac',
                  borderRadius: '50%',
                }} />
            </Button>
            <ProfileImageUploadPopUp open={uploadPopupOpen} onClose={handleCloseUploadPopup}
            onSave={handleSaveImage} profileImage={userInfo.profileImage} />
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>{userInfo.nickName}</Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>{userInfo.email}</Box>
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                내프로필
              </Button>
            </Box>
          </Box>
        </Container>
        </Grid>
        {/* 여기서부턴 정보를 나타내는 공간 -> 컴포넌트화 할 수 있음 */}
        <Grid item xs={8}>
          <Container sx={{ m:3 }}>
            <CardProfile title="기본 정보" buttonText="수정하기" /><br/>
            <CardProfile title="연인 정보" buttonText="헤어지기" /><br/>
            <CardProfile title="쿠폰 정보(예정)" buttonText="사용하기" /><br/>
            <Button>회원탈퇴</Button>
          </Container>
        </Grid>
      </Grid>
    </ThemeProvider>
  </>
  );
}