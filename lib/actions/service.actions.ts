'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return { success: false, error: 'Failed to fetch services' };
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return { success: true, data: service };
  } catch (error) {
    console.error(`Failed to fetch service with id ${id}:`, error);
    return { success: false, error: 'Failed to fetch service' };
  }
}

export async function createService(data: {
  title: string;
  description: string;
  isFree: boolean;
  price?: number | null;
}) {
  try {
    const service = await prisma.service.create({
      data,
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true, data: service };
  } catch (error) {
    console.error('Failed to create service:', error);
    return { success: false, error: 'Failed to create service' };
  }
}

export async function updateService(
  id: string,
  data: {
    title?: string;
    description?: string;
    isFree?: boolean;
    price?: number | null;
  }
) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data,
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true, data: service };
  } catch (error) {
    console.error(`Failed to update service with id ${id}:`, error);
    return { success: false, error: 'Failed to update service' };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });
    
    revalidatePath('/admin/services');
    revalidatePath('/services');
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete service with id ${id}:`, error);
    return { success: false, error: 'Failed to delete service' };
  }
}

export async function checkIfServiceIsFree(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      select: { isFree: true }
    });
    
    if (!service) return { success: false, error: 'Service not found' };
    
    return { success: true, isFree: service.isFree };
  } catch (error) {
    console.error(`Failed to check if service ${id} is free:`, error);
    return { success: false, error: 'Failed to check service status' };
  }
}
