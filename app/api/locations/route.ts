import { NextRequest, NextResponse } from 'next/server';
/* Datenquelle:  https://github.com/zauberware/postal-codes-json-xml-csv
 */
import allLocations from '@/lib/zipcodes.de.json';

export function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') ?? '';

  const locations = search.length > 1 ? getLocations(search) : [];

  // Kurze Varianten, fügt automatisch Statuscode 200 und Conten-Type JSON hinzu.
  return NextResponse.json(locations);
}



function getLocations(searchTerm: string) {
  /*  Datensatz filtern, zipcode ist ein String und kein Integer, da
    PLZ mit 0 beginnen können. startsWith ist einen String-Methode, die
    prüft, ob ein String mit einem anderen String beginnt, und entsprechend
    true oder false zurückgibt.
    Bei der Ortssuche wird ein Regulärer Ausdruck verwendet, um nicht nur den
    Anfang des Strings zu suchen und dadurch auch Stadteile wie "Berlin Kreuzberg"
    oder Orte wie "Lutherstadt Wittenberg" zu finden. 

  */

  const regExp = new RegExp(searchTerm, 'i');
  return allLocations.filter((location)=> location["state_code"] === "BE"
  ).filter(
    ({ zipcode, place }) => zipcode.startsWith(searchTerm) || regExp.test(place)
  );
}
