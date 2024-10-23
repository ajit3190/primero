# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for Theme
# rubocop:disable Naming/VariableNumber
class Theme < ApplicationRecord
  COLOR_PROPERTIES = %w[
    manifestThemeColor forgotPasswordLink networkIndicatorButton navListIconColor navDivider
    toolbarBackgroundColor toolbarBackgroundButtonColor navListBgActive navListTextActive
    navListIconActive navListText navListIcon navListDivider loginBackgroundGradientStart
    loginBackgroundGradientEnd toolbarBackgroundColorMobileHeader drawerHeaderButton
    loginTranslationsButtonBackground loginTranslationsButtonText mobileToolbarBackground
    mobileToolbarHamburgerButton loginButtonBg loginButtonText
  ].freeze

  DEFAULT_THEME = {
    show_powered_by_primero: false,
    use_contained_nav_style: false,
    site_title: 'Primero',
    site_description: 'Primero is an open source software platform that helps social services,
    humanitarian and development workers manage protection-related data, with tools that facilitate case management,
    incident monitoring and family tracing and reunification.',
    email_disclaimer_pre: { en: 'DO NOT REPLY TO THIS EMAIL' },
    email_disclaimer: { en: [
        'The content of this message does not necessarily reflect the official position of UNICEF. Electronic messages',
        'are not secure or error free and may contain viruses or may be delayed, and the sender is not liable for any',
        'of these occurrences. The sender reserves the right to monitor, record and retain electronic messages.',
        ].join(' ')
    },
    email_copyright: { en:'' },
    email_warning: { en: [
        'The information contained in this electronic message and any attachments is intended for specific individuals',
        'or entities, and may be confidential, proprietary or privileged. If you are not the intended recipient,',
        'please notify the sender immediately, delete this message and do not disclose, distribute or copy it to',
        'any third party or otherwise use this message.'
        ].join('')
    },
    email_welcome_greeting: { en:'Welcome to the Primero Community' },
    email_closing: { en:'At your service'},
    email_signature: { en: 'Primero team' },
    email_admin_name: { en: 'Primero System Administrator' },
    email_help_links: [
      {
        name: { en: 'Primero Support Hub' },
        href: 'http://support.primero.org/',
        description: { en: 'You can access comprehensive user guides and documentation' },
        icon_url: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_960,w_480,f_auto,q_auto/195711/367136_502444.png'
      },
      {
        name: { en: 'Primero Community Forum' },
        href: 'https://community.primero.org/',
        description: { en: 'Technical support for system administrators' },
        icon_url: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_960,w_480,f_auto,q_auto/195711/586625_291148.png'
      },
      {
        name: { en: 'Instagram' },
        href: 'https://www.instagram.com/primeroprotects/',
        description: { en: 'Stay in touch and follow our work' },
        icon_url: 'https://uploads.strikinglycdn.com/static/icons/black/instagram-icon.png'
      },
      {
        name: { en: 'Youtube' },
        href: 'https://www.youtube.com/channel/UCRe6ziywtDB4FbPLLg-Ogzw',
        description: { en: 'View instructional videos' },
        icon_url: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_960,w_480,f_auto,q_auto/195711/421819_837492.png'
      }
    ],
    email_link_color: '#0093B8',
    email_footer_background_color: '#F3F3F3',
    email_help_link_background_color: '#F8FCFD',
    email_logo: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_auto/195711/_IMS-logos_all_TM-02_no_bg_2_rlfcbj.png',
    colors: {
      'manifestThemeColor' => '#0093ba'
    },
    revision: SecureRandom.uuid
  }.freeze.with_indifferent_access

  PICTORIAL_SIZES = %w[144 192 256].freeze

  store_accessor :data, :site_description, :site_title, :colors, :use_contained_nav_style, :show_powered_by_primero,
                 :revision, :email_link_color, :email_footer_background_color, :email_help_link_background_color,
                 :email_logo, :email_help_links, :email_signature, :email_closing, :email_welcome_greeting,
                 :email_warning, :email_copyright, :email_disclaimer, :email_disclaimer_pre, :email_admin_name

  has_one_attached :login_background
  has_one_attached :logo
  has_one_attached :logo_white
  has_one_attached :logo_pictorial_144
  has_one_attached :logo_pictorial_192
  has_one_attached :logo_pictorial_256
  has_one_attached :favicon

  validate :valid_html_colors
  validates :logo, presence: true
  validates :logo_white, presence: true
  validates :logo_pictorial_144, presence: true
  validates :logo_pictorial_192, presence: true
  validates :logo_pictorial_256, presence: true
  validates :favicon, presence: true
  # rubocop:enable Naming/VariableNumber

  before_save :generate_new_revision

  def generate_new_revision
    self.revision = SecureRandom.uuid
  end

  def valid_html_colors
    return unless colors.present?

    invalid_color_keys = []
    colors.each { |key, color| invalid_color_keys << key unless color.match(/#\h{6}/) }

    return unless invalid_color_keys.present?

    errors.add(:colors, "must be a valid hexadecimal color (#{invalid_color_keys.join(',')})")
  end

  class << self
    def default
      @default ||= new(DEFAULT_THEME)
    end

    def current
      where(disabled: false).order(created_at: :desc).first
    end
  end
end
