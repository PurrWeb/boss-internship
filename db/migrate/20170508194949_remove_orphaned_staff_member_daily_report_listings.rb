class RemoveOrphanedStaffMemberDailyReportListings < ActiveRecord::Migration
  def change
    DailyReportStaffMemberListing.
      where('daily_report_staff_member_section_id NOT IN (SELECT DISTINCT id FROM daily_report_staff_member_sections)').
      delete_all
  end
end
