/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      edges {
        node {
          _id
          id
          name
        }
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!) {
    createProduct(input: { name: $name }) {
      product {
        _id
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String!) {
    updateProduct(input: { id: $id, name: $name }) {
      product {
        _id
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      product {
        id
      }
    }
  }
`;

export { CREATE_PRODUCT, DELETE_PRODUCT, GET_PRODUCTS, UPDATE_PRODUCT };
