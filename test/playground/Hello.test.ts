import { handler } from '../../services/SpacesTable/Create';

const event = {
  body: {
    location: '123 Main St',
  },
};

handler(event as any, {} as any);
