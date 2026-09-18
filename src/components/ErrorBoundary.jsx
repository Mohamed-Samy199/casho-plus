import { Component } from "react";
import { RefreshCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // ممكن تبعت ده لخدمة تتبع أخطاء (Sentry مثلًا) لاحقًا
    console.error("Unexpected UI error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-lg font-bold">حصل خطأ غير متوقع</p>
          <p className="text-sm text-text-secondary">
            جرب تحدّث الصفحة، ولو المشكلة استمرت كلّم الدعم الفني.
          </p>
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <RefreshCcw size={16} />
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}