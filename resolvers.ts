import { Collection, ObjectId } from "mongodb";
import { Flight, FlightModel } from "./types.ts";
import { fromModelToFlight } from "./utils.ts";

export const resolvers = {
  Query: {
    flights: async (
      _: unknown,
      args:{origin:string, destination:string},
      context: { FlightsCollection: Collection<FlightModel> },
    ): Promise<Flight[]> => {
      if(!args.destination && !args.destination){
        const flightModel = await context.FlightsCollection.find().toArray();
        return flightModel.map((flightModel) =>
          fromModelToFlight(flightModel)
        );
      }
      else if(args.origin){
        const query: FlightModel= {origin:"",destination:"",dateAndTime:""};  
        query.origin = args.origin;
        const flightModel = await context.FlightsCollection.find(query).toArray();
        return flightModel.map((flightModel) =>
          fromModelToFlight(flightModel)
        );
      }
      else if(args.destination){
        const query: FlightModel= {origin:"",destination:"",dateAndTime:""};  
        query.destination = args.destination;
        const flightModel = await context.FlightsCollection.find(query).toArray();
        return flightModel.map((flightModel) =>
          fromModelToFlight(flightModel)
        );
      }
      else return [];

    },
    flight: async (
      _: unknown,
      { id }: { id: string },
      context: {
        FlightCollection: Collection<FlightModel>;
      },
    ): Promise<Flight | null> => {
      const flightModel = await context.FlightCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!flightModel) {
        return null;
      }
      return fromModelToFlight(flightModel);
    },
  },
  Mutation: {
    addFlight: async (
      _: unknown,
      args: { origin: string; destination: string, dateAndTime: string },
      context: {
        FlightCollection: Collection<FlightModel>;
      },
    ): Promise<Flight> => {
      const { origin, destination, dateAndTime } = args;
      const { insertedId } = await context.FlightCollection.insertOne({
        origin,
        destination,
        dateAndTime,
      });
      const flightModel = {
        _id: insertedId,
        origin,
        destination,
        dateAndTime
      };
      return fromModelToFlight(flightModel!);
    },
  },
};