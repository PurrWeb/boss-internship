module AlertHelper
  def bootstrap_alert_class_for(alert_type)
    {
      success: "alert-success",
      error: "alert-danger",
      alert: "alert-warning",
      notice: "alert-info"
    }[alert_type.to_sym] || alert_type.to_s
  end

  def bootstrap_alert_dismissable_class_for(alert_type)
    {
      success: "alert-dismissible",
      error: "",
      alert: "",
      notice: "alert-dismissible"
    }[alert_type.to_sym] || ""
  end
end
