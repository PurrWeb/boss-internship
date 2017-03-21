// import {TableSession, Table} from '../../interfaces/backend-models';
// // tslint:disable-next-line:no-require-imports
// const t = require('tcomb-validation');
//
// const tTableType = t.enums.of(['pool', 'shuffleBoard', 'tableTennis', 'generic'], 'tTableType');
// const tTableStatus = t.enums.of(['enabled', 'disabled'], 'tTableStatus');
// const tNullableInt = <number | null>t.union([t.Integer, t.Nil], 'tNullableInt');
// const tPositive = t.refinement(t.Number, (n: number) => n >= 0, 'tPositive');
// const tPositiveInt = t.intersection([tPositive, t.Integer], 'tPositiveInt');
// const tPositiveNullableInt = t.intersection([tPositive, tNullableInt], 'tPositiveNullableInt');
// const tNonEmptyString = t.refinement(t.String, (str: string) => !!str, 'tNonEmptyString');
//
// export const tTableSession = <TableSession>t.interface({
//   id: tPositiveInt,
//   startsAt: tNonEmptyString,
//   durationSeconds: tPositiveNullableInt,
//   adminEdited: t.Boolean
// });
//
// export const tNullableSession = <TableSession | null>t.union([tTableSession, t.Nil]);
//
// export const tTable = <Table>t.interface({
//   name: t.String,
//   id: tPositiveInt,
//   tableType: tTableType,
//   status: tTableStatus,
//   currentSession: tNullableSession,
//   lastSession: tNullableSession
// });
