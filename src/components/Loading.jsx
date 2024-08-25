import React from 'react';
import { Container, Space, Skeleton } from '@mantine/core';

export default function Loading() {
  return (
    <Container style={{ padding: '0px 40px', borderRadius: "8px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Space h="lg" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Container>
  );
}