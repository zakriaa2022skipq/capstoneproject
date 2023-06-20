import '@testing-library/jest-dom';
import React from 'react';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
global.React = React;
