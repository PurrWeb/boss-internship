import React from 'react';
// import Header from '~/components/containers/header/header.js';
import renderer from 'react-test-renderer';

var quickMenu = [{"name":"Venue","color":"#e74c3c","items":[{"description":"Rota","permitted":true,"path":"/rotas"},{"description":"Security Rota","permitted":true,"path":"/security_rotas"},{"description":"Change Orders","permitted":true,"path":"/change_orders"},{"description":"Safe Checks","permitted":true,"path":"/safe_checks"}]},{"name":"Staff Members","color":"#27ae60","items":[{"description":"Hours Confirmation","permitted":true,"path":"/hours_confirmation/current"},{"description":"Holidays","permitted":true,"path":"/holidays?date=10-07-2017"},{"description":"Add Staff Member","permitted":true,"path":"/staff_members/new"}]},{"name":"Dayly Report","color":"#9b59b6","items":[{"description":"Dayly Report","permitted":true,"path":"/daily_reports"},{"description":"Weekly Report","permitted":true,"path":"/weekly_reports"},{"description":"Payroll Reports","permitted":true,"path":"/payroll_reports"}]},{"name":"Admin: General","color":"#e67e22","items":[{"description":"Names","path":"/names"},{"description":"Venues","path":"/venues"}]},{"name":"Admin: Users","color":"#1abc9c","items":[{"description":"Invites","path":"/invites"}]},{"name":"Admin: Staff Members","color":"#3498db","items":[{"description":"Staff Type","path":"/staff_types"},{"description":"Pay Rates","path":"/pay_rates"},{"description":"Staff Vetting","path":"/staff_vetting"},{"description":"Staff Tracking","path":"/staff_tracking"}]},{"name":"Admin: Venue","color":"#c0392b","items":[{"description":"Dayly Report","permitted":true,"path":"/daily_reports"},{"description":"Weekly Report","permitted":true,"path":"/weekly_reports"},{"description":"Payroll Reports","permitted":true,"path":"/payroll_reports"}]},{"name":"Admin: Reports","color":"#f39c12","items":[{"description":"Finance Reports","path":"/finance_reports"},{"description":"Yearly Reports","path":"/yearly_reports"}]}];

console.log(quickMenu);

// test('Quick menu should be show when hover', () => {
//   const component = renderer.create(
//     <Header />
//   );

//   console.log(component);
// })
