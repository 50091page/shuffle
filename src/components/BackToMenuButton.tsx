type BackToMenuButtonProps = {
  onClick: () => void;
};

export function BackToMenuButton({ onClick }: BackToMenuButtonProps) {
  return (
    <button
      type="button"
      className="menu-chip"
      onClick={onClick}
      aria-label="메인 메뉴로 이동"
    >
      ← 뒤로가기
    </button>
  );
}
