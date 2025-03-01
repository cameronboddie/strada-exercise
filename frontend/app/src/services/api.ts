import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth, User } from 'firebase/auth';
import {
  Collection, NewCollection, Content, NewContent, Invoice,
} from '../types/models.ts';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: async (headers) => {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Collection', 'Content', 'Invoice', 'Teams'],
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      query: () => '/collections/',
      providesTags: [{ type: 'Collection', id: 'LIST' }],
    }),

    getCollection: builder.query<Collection, number>({
      query: (collectionId) => `/collections/${collectionId}`,
      // @ts-ignore
      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),
    getContentByCollectionId: builder.query<Content[], number>({
      query: (collectionId) => `/collections/${collectionId}/content`,
      // @ts-ignore
      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),
    getSubCollections: builder.query<Collection[], number>({
      query: (collectionId) => `/collections/${collectionId}/collections`,
      // @ts-ignore
      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),

    createCollection: builder.mutation<Collection, NewCollection>({
      query: (newCollection) => ({
        url: '/collections/',
        method: 'POST',
        body: newCollection,
      }),
      invalidatesTags: [{ type: 'Collection', id: 'LIST' }],
    }),

    updateCollection: builder.mutation<Collection, { collectionId: number; newCollection: Partial<NewCollection> }>({
      query: ({ collectionId, newCollection }) => ({
        url: `/collections/${collectionId}`,
        method: 'PATCH',
        body: newCollection,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { collectionId }) => [{ type: 'Collection', id: collectionId }, { type: 'Collection', id: 'LIST' }],
    }),
    getContent: builder.query<Content[], void>({
      query: () => ({
        url: '/content/',
        method: 'GET',
      }),
      providesTags: [{type: 'Content', id: 'LIST'}],
    }),

    createContent: builder.mutation<Content, NewContent>({
      query: (newContent) => ({
        url: '/content/',
        method: 'POST',
        body: newContent,
      }),
      // @ts-ignore
      invalidatesTags: (result, error, { collection_id }) => [{ type: 'Collection', id: collection_id }, { type: 'Collection', id: 'LIST' }],
    }),
    getInvoices: builder.query<Invoice[], void>({
      query: () => ({
        url: '/invoices/',
        method: 'GET',
      }),
      providesTags: ['Invoice'],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetContentQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useCreateContentMutation,
  useGetInvoicesQuery,
  useGetContentByCollectionIdQuery,
  useGetSubCollectionsQuery,
} = api;
