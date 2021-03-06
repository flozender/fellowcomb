import React from "react";
import { Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import { useParams } from "react-router";
import Profile from "../components/profile";
import ClusterWrapper from "../components/clusterWrapper";
import PodData from "../components/podData";

import { USER } from "../gql/user";
import { ME } from "../gql/me";
import { useQuery } from "@apollo/react-hooks";

const User = () => {
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const { username } = useParams();

  const toast = useToast();
  const triggerToast = ({ title, description, status }) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const { loading: meLoading, error: meError, data: meData } = useQuery(ME);
  console.log("USERNAME", username);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(USER, { variables: { username } });

  if (userLoading || meLoading)
    return <Spinner size="xl" speed="0.50s" color="yellow.500" />;

  const guest = meData.me.username !== username;

  if (userError || meError) {
    triggerToast({
      title: "An error has occurred!",
      status: "error",
    });
  }
  console.log("USER", userData);
  const currentUser = userData.user;

  return (
    <Flex w="100%" align="center" direction="column">
      <Box w="100%" p={10} backgroundColor="gray.50" borderRadius={14}>
        <Profile
          user={{
            username: currentUser.username,
            guest,
            name: currentUser.name,
            calendly: currentUser.calendly || "",
            linkedin: currentUser.linkedin || "",
            github: currentUser.github_url,
            discord: `https://discordapp.com/users/${currentUser.discord_id}`,
            color: color,
            discord_id: currentUser.discord_id,
            pictureURL: currentUser.pictureURL,
          }}
        />
        <PodData
          podLeaders={currentUser.podLeaders}
          mentors={currentUser.mentors}
        />
      </Box>

      <ClusterWrapper
        username={currentUser.username}
        clusters={currentUser.clusters}
        color={color}
      />
    </Flex>
  );
};

export default User;
