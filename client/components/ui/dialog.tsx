import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { scheduleRestoreDocumentInteractivity } from "@/lib/interactivity";

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const Dialog = (props: React.ComponentProps<typeof DialogPrimitive.Root>) => {
  const lastActive = React.useRef<HTMLElement | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (open) {
      try {
        lastActive.current = document.activeElement as HTMLElement | null
      } catch {}
      // In case previous dialogs left the page inert, proactively restore interactivity
      try { scheduleRestoreDocumentInteractivity(0) } catch {}
    } else {
      // restore focus to previously focused element after animations
      setTimeout(() => {
        try {
          lastActive.current?.focus()
        } catch {}

        // Cleanup any lingering overlays / focus traps that may block interactions
        try {
          // Hide/disable any closed Radix overlay/content elements left in DOM
          Array.from(document.querySelectorAll('[data-state="closed"]')).forEach((el) => {
            try {
              if (el instanceof HTMLElement && (el.classList.contains('fixed') || el.classList.contains('z-50'))) {
                // el.style.pointerEvents = 'none'
                // el.style.display = 'none'
              }
            } catch {}
          })

          // Remove inert attributes that may prevent interaction
          Array.from(document.querySelectorAll('[inert]')).forEach((el) => {
            try { el.removeAttribute('inert') } catch {}
          })

          // Remove react-focus-lock markers if present (restores pointer events)
          Array.from(document.querySelectorAll('[data-react-focus-lock]')).forEach((el) => {
            try {
              if (el instanceof HTMLElement) {
                el.style.pointerEvents = 'auto'
              }
            } catch {}
          })

          // Remove aria-hidden and tabindex=-1 from main page siblings (Radix sets these when dialog opens)
          const dialogPortals = Array.from(document.querySelectorAll('[data-radix-portal], [data-radix-portal-root]'))
          const bodyChildren = Array.from(document.body.children)
          bodyChildren.forEach((child) => {
            try {
              // skip dialog portal nodes
              if (dialogPortals.includes(child)) return
              if (child instanceof HTMLElement) {
                if (child.hasAttribute('aria-hidden')) child.removeAttribute('aria-hidden')
                // remove any tabindex added to trap focus
                if (child.getAttribute('tabindex') === '-1') child.removeAttribute('tabindex')
                // ensure pointer events enabled
                child.style.pointerEvents = 'auto'
              }
            } catch {}
          })
        } catch {}

        // Finally, schedule a restore to catch anything set by async transitions
        try { scheduleRestoreDocumentInteractivity(0) } catch {}
      }, 250)
    }

    if (typeof props.onOpenChange === "function") {
      props.onOpenChange(open)
    }
  }

  return <DialogPrimitive.Root {...props} onOpenChange={handleOpenChange} />
}

// keep displayName for compatibility
Dialog.displayName = DialogPrimitive.Root.displayName || "Dialog";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const localRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const el = localRef.current
    if (!el) return

    const updatePointer = () => {
      const state = el.getAttribute("data-state")
      if (state === "closed") {
        el.style.pointerEvents = "none"
      } else {
        el.style.pointerEvents = "auto"
      }
    }

    // Initial
    updatePointer()

    // Observe data-state changes
    const obs = new MutationObserver(() => updatePointer())
    obs.observe(el, { attributes: true, attributeFilter: ["data-state"] })

    return () => obs.disconnect()
  }, [])

  return (
    <DialogPrimitive.Overlay
      ref={(node) => {
        localRef.current = node as any
        if (typeof ref === "function") ref(node as any)
        else if (ref) (ref as any).current = node
      }}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 pointer-events-auto data-[state=closed]:pointer-events-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  )
})
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
